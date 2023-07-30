package main

import (
	"os"
	"log"
	"crypto/rand"
	"fmt"
	"strings"
	"flag"
)

var (
	IS    = []byte{0xd3,0xa2,0xaf,0x8a,0x28,0x38,0xb5,0x7f,0xe4,0x80,0xcb,0x3e,0xd0,0x5a,0x2d,0x17}
	NAME  = []byte{0x85,0x42,0xff,0x85,0xf6,0x91,0x3b,0xdd,0x26,0x89,0xf4,0x98,0x1c,0x26,0x90,0x42}
	BYTES = []byte{0x01,0xe8,0x7e,0xd4,0x13,0xb3,0x47,0xb9,0xef,0x84,0xdf,0x7a,0xba,0xb7,0x4c,0x28}
)

func main() {

	var err error

	if len(os.Args) == 1 {
		err = printLinks(os.Stdin)
	} else {
		switch os.Args[1] {
		case "print-nodes":
			err = printNodes(os.Stdin)
		case "print-list":
			printListFlagSet := flag.NewFlagSet("print-list", flag.ContinueOnError)
			printListRoot := printListFlagSet.String("root", "", "")
			printListVia  := printListFlagSet.String("via", "", "")
			err = printListFlagSet.Parse(os.Args[2:]); 
			if err != nil {
				break
			}
			if *printListRoot == "" {
				err = fmt.Errorf("print-list requires --root argument")
			}
			if *printListVia == "" {
				err = fmt.Errorf("print-list requires --via argument")
			}
			err = printList(os.Stdin, *printListRoot, *printListVia)
		case "dir":
			err = dirToStream(".", os.Stdout)
		case "gonode":
			node := make([]byte, 16)
			rand.Read(node)
			hexStrings := make([]string, 16)
			for i, b := range node {
				hexStrings[i] = fmt.Sprintf("0x%02x", b)
			}
			fmt.Printf("[]byte{%s}\n", strings.Join(hexStrings, ","));
		}
	}

	if err != nil {
		log.Fatal(err)
	}
}
