package main

import (
	"io"
	"os"
	"fmt"
	"strings"
	"path/filepath"
	"mime"
	"math/rand"
	"sort"
)

var (
	DIR           = []byte{0x10,0x8b,0xdb,0x13,0x4e,0x0b,0x91,0x83,0xd5,0xf4,0xe9,0x1a,0x76,0xb0,0x31,0x2a}
	FILE_CONTENT  = []byte{0x39,0xce,0x16,0x74,0x5f,0x67,0x45,0xb1,0x32,0xeb,0x9f,0x09,0x89,0xd3,0x9f,0x17}
	MIME_TYPE     = []byte{0x13,0xbe,0x6b,0x64,0x86,0xe5,0xa2,0x96,0xcf,0x30,0x36,0x61,0x8c,0x45,0xe3,0x04}
	NEXT_FS_ENTRY = []byte{0x87,0x76,0xdf,0x87,0xa5,0x8d,0xd4,0xd1,0x52,0x40,0x79,0x54,0xc9,0x22,0xda,0x9d}
)

func dirToStream(path string, w io.Writer) error {
	err := writeLinks(w, [][3][]byte{
		{IS, UTF8, []byte("is")},
		{DIR, UTF8, []byte("Dir")},
		{UTF8, UTF8, []byte("UTF8")},
		{FILE_CONTENT, UTF8, []byte("file-content")},
		{NAME, UTF8, []byte("name")},
		{BYTES, UTF8, []byte("bytes")},
		{MIME_TYPE, UTF8, []byte("mime-type")},
		{NEXT_FS_ENTRY, UTF8, []byte("next-fs-entry")},
	})
	if err != nil {
		return err
	}

	rnd := rand.New(rand.NewSource(0))
	makeNode := func () []byte {
		node := make([]byte, 16)
		rnd.Read(node)
		return node
	}

	dir, err := os.Open(".")
	if err != nil {
		return err
	}

	entries, err := dir.ReadDir(0)
	if err != nil {
		return err
	}

	sort.Slice(entries, func (i, j int) bool {
		return entries[i].Name() < entries[j].Name()
	})

	var prevEntry []byte
	for _, entry := range entries {
		entryNode := makeNode()
		err = writeLinks(w, [][3][]byte{
			// {entryNode, IS, DIR},
			{entryNode, UTF8, []byte(entry.Name())},
		})
		if err != nil {
			return err
		}

		if len(prevEntry) > 0 {
			err = writeLink(w, prevEntry, NEXT_FS_ENTRY, entryNode)
			if err != nil {
				return err
			}
		}
		prevEntry = entryNode

		if !entry.IsDir() {
			fileContent, err := os.ReadFile(path + "/" + entry.Name())
			if err != nil {
				return fmt.Errorf("Error reading file '%s': %s", path + "/" + entry.Name(), err)
			}

			fileContentNode := makeNode()
			err = writeLink(w, entryNode, FILE_CONTENT, fileContentNode)
			if err != nil {
				return err
			}

			ext := filepath.Ext(entry.Name())
			mimeType := mime.TypeByExtension(ext)

			if mimeType != "" {
				err = writeLinks(w, [][3][]byte{
					{entryNode, MIME_TYPE, []byte(mimeType)},
					{makeNode(), UTF8, []byte(mimeType)},
				})
				if err != nil {
					return err
				}
			}

			if strings.HasSuffix(entry.Name(), ".go") {
				err = writeLink(w, fileContentNode, UTF8, fileContent)
			} else {
				err = writeLink(w, entryNode, BYTES, fileContent)
			}
			if err != nil {
				return err
			}
		}
	}

	return nil
}
