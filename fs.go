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
	writeLink(w, IS, UTF8, []byte("is"))
	writeLink(w, DIR, UTF8, []byte("Dir"))
	writeLink(w, UTF8, UTF8, []byte("UTF8"))
	writeLink(w, FILE_CONTENT, UTF8, []byte("file-content"))
	writeLink(w, NAME, UTF8, []byte("name"))
	writeLink(w, BYTES, UTF8, []byte("bytes"))
	writeLink(w, MIME_TYPE, UTF8, []byte("mime-type"))
	writeLink(w, NEXT_FS_ENTRY, UTF8, []byte("next-fs-entry"))

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
		writeLink(w, entryNode, IS, DIR)
		writeLink(w, entryNode, UTF8, []byte(entry.Name()))

		if len(prevEntry) > 0 {
			writeLink(w, prevEntry, NEXT_FS_ENTRY, entryNode)
		}
		prevEntry = entryNode

		if !entry.IsDir() {
			fileContent, err := os.ReadFile(path + "/" + entry.Name())
			if err != nil {
				return fmt.Errorf("Error reading file '%s': %s", path + "/" + entry.Name(), err)
			}

			fileContentNode := makeNode()
			writeLink(w, entryNode, FILE_CONTENT, fileContentNode)

			ext := filepath.Ext(entry.Name())
			mimeType := mime.TypeByExtension(ext)

			if mimeType != "" {
				writeLink(w, entryNode, MIME_TYPE, []byte(mimeType))
				writeLink(w, makeNode(), UTF8, []byte(mimeType))
			}

			if strings.HasSuffix(entry.Name(), ".go") {
				writeLink(w, fileContentNode, UTF8, fileContent)
			} else {
				writeLink(w, entryNode, BYTES, fileContent)
			}
		}
	}

	return nil
}
