package main

import (
	"io"
	"crypto/sha256"
	"encoding/binary"
	"fmt"
	"strings"
)

func hashBytes(b []byte) uint64 {
	sum := sha256.Sum256(b)
	return binary.BigEndian.Uint64(sum[:])
}

type printType int

const (
	printTypeHex printType = 1
	printTypeString printType = 2
)

type Printable struct {
	Type printType
	Str string
}

func printPrintable(p Printable) {
	TerminalColorReset := "\033[0m"
	TerminalColorBlue  := "\033[34m"
	TerminalColorGreen := "\033[32m"

	switch p.Type {
	case printTypeHex:
		fmt.Print(TerminalColorBlue)
	case printTypeString:
		fmt.Print(TerminalColorGreen)
	}

	fmt.Print(p.Str)

	fmt.Print(TerminalColorReset)
}

func parseStreamForPrinting(r io.Reader) (linkHashes [][3]uint64, hashToBytesMap map[uint64][]byte, hashToPrintableMap map[uint64]Printable, err error) {
	linkHashes = make([][3]uint64, 0)
	hashToPrintableMap = make(map[uint64]Printable)
	hashToBytesMap = make(map[uint64][]byte)
	hashToUtf8StringMap := make(map[uint64]string)
	utf8Hash := hashBytes(UTF8)

	for {
		from, via, to, readErr := readLink(r)
		if readErr != nil {
			if readErr == io.EOF {
				break
			} else {
				err = readErr
				return
			}
		}

		fromHash := hashBytes(from)
		viaHash  := hashBytes(via)
		toHash   := hashBytes(to)

		linkHashes = append(linkHashes, [3]uint64{fromHash, viaHash, toHash})

		hashToBytesMap[fromHash] = from
		hashToBytesMap[viaHash] = via
		hashToBytesMap[toHash] = to

		if viaHash == utf8Hash {
			hashToUtf8StringMap[fromHash] = string(to)
		}
	}

	for hash, data := range hashToBytesMap {
		if str, ok := hashToUtf8StringMap[hash]; ok {
			firstLine, _, hasNewline := strings.Cut(str, "\n")
			if hasNewline {
				hashToPrintableMap[hash] = Printable{printTypeString, fmt.Sprintf("%s...", firstLine)}
			} else {
				hashToPrintableMap[hash] = Printable{printTypeString, str}
			}
		} else {
			minDigits := 1
			for otherHash, otherData := range hashToBytesMap {
				if otherHash != hash {
					for i:=0; i<len(data) && i<len(otherData); i++ {
						if minDigits < i+1 {
							minDigits = i+1
						}
						if data[i] != otherData[i] {
							break
						}
					}
				}
			}
			if len(data) > 16 {
				hashToPrintableMap[hash] = Printable{printTypeHex, fmt.Sprintf("0x%02x...", data[:16])}
			} else {
				hashToPrintableMap[hash] = Printable{printTypeHex, fmt.Sprintf("0x%02x", data)}
			}
		}
	}

	return
}

func printNodes(r io.Reader) error {
	_, _, hashToPrintableMap, err := parseStreamForPrinting(r)
	if err != nil {
		return err
	}

	for _, printString := range hashToPrintableMap {
		printPrintable(printString)
		fmt.Print("\n")
	}

	return nil
}

func printLinks(r io.Reader) error {
	linkHashes, _, hashToPrintableMap, err := parseStreamForPrinting(r)
	if err != nil {
		return err
	}

	for _, link := range linkHashes {
		printPrintable(hashToPrintableMap[link[0]])
		fmt.Print(" -> ")
		printPrintable(hashToPrintableMap[link[1]])
		fmt.Print(" -> ")
		printPrintable(hashToPrintableMap[link[2]])
		fmt.Print("\n")
	}

	return nil
}

func lookupPrintableMap(str string, hashToPrintableMap map[uint64]Printable) (uint64, error) {
	var hash uint64
	for h, printable := range hashToPrintableMap {
		if printable.Str == str {
			if hash != 0 {
				return 0, fmt.Errorf("'%s' is ambiguous, multiple nodes have this printable representation.", str)
			}
			hash = h
		}
	}
	if hash == 0 {
		return hash, fmt.Errorf("Node '%s' not found.", str)
	}
	return hash, nil
}

func printLinksWithFilter(r io.Reader, nodePrintString string) error {
	linkHashes, _, hashToPrintableMap, err := parseStreamForPrinting(r)
	if err != nil {
		return err
	}

	nodeHash, err := lookupPrintableMap(nodePrintString, hashToPrintableMap)
	if err != nil {
		return err
	}

	for _, link := range linkHashes {
		if link[0] == nodeHash || link[1] == nodeHash || link[2] == nodeHash {
			printPrintable(hashToPrintableMap[link[0]])
			fmt.Print(" -> ")
			printPrintable(hashToPrintableMap[link[1]])
			fmt.Print(" -> ")
			printPrintable(hashToPrintableMap[link[2]])
			fmt.Print("\n")
		}
	}

	return nil
}

func printList(r io.Reader, listRootPrintString string, listViaPrintString string) error {
	linkHashes, _, hashToPrintableMap, err := parseStreamForPrinting(r)
	if err != nil {
		return err
	}

	listRootHash, err := lookupPrintableMap(listRootPrintString, hashToPrintableMap)
	if err != nil {
		return err
	}

	listViaHash, err := lookupPrintableMap(listViaPrintString, hashToPrintableMap)
	if err != nil {
		return err
	}

	listMap := make(map[uint64]uint64)
	for _, l := range linkHashes {
		if l[1] == listViaHash {
			if val, alreadyFound := listMap[l[0]]; alreadyFound && val != l[2] {
				return fmt.Errorf("Cannot traverse list: %s connects to both %s and %s", hashToPrintableMap[l[0]].Str, hashToPrintableMap[val].Str, hashToPrintableMap[l[2]].Str)
			}
			listMap[l[0]] = l[2]
		}
	}

	nodeHash := listRootHash
	for nodeHash != 0 {
		printPrintable(hashToPrintableMap[nodeHash])
		fmt.Print("\n")
		nodeHash = listMap[nodeHash]
	}
	return nil
}
