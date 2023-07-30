package main

import (
	"encoding/binary"
	"io"
	"fmt"
	"log"
	"crypto/rand"
)

const (
	MAX_PACKET_SIZE = 0xFF - 1
	PACKET_CONTINUATION = uint16(0xFF)
)

func makeUniqueNode() []byte {
	node := make([]byte, 16)
	rand.Read(node)
	return node
}

func writeNode(w io.Writer, b []byte) {
	// TODO: Allow writing zero-sized nodes
	bytesWritten := 0
	for bytesWritten < len(b) {
		packetSize := len(b) - bytesWritten
		if packetSize > MAX_PACKET_SIZE {
			packetSize = MAX_PACKET_SIZE
			binary.Write(w, binary.BigEndian, PACKET_CONTINUATION)
		}
		binary.Write(w, binary.BigEndian, uint16(packetSize))
		w.Write(b[bytesWritten:bytesWritten+packetSize])
		bytesWritten += packetSize
	}
}

func readNode(r io.Reader) ([]byte, error) {
	var node []byte

	for {
		var packetSize uint16
		err := binary.Read(r, binary.BigEndian, &packetSize)
		if err != nil {
			return []byte{}, err
		}

		isContinuation := packetSize == PACKET_CONTINUATION
		if isContinuation {
			err := binary.Read(r, binary.BigEndian, &packetSize)
			if err != nil {
				return []byte{}, err
			}
			if packetSize == PACKET_CONTINUATION {
				log.Fatal("Invalid packet: read two continuation markers in a row")
			}
		}

		packet := make([]byte, packetSize)
		if packetSize > 0 {
			bytesRead, err := r.Read(packet)
			if err != nil || bytesRead != int(packetSize) {
				return []byte{}, err
			}
		}

		node = append(node, packet...)

		if !isContinuation {
			break
		}
	}

	return node, nil
}

func writeLink(w io.Writer, from, via, to []byte) {
	writeNode(w, from)
	writeNode(w, via)
	writeNode(w, to)
}

func readLink(r io.Reader) (from []byte, via []byte, to []byte, err error) {
	from, err = readNode(r)
	if err != nil {
		return
	}

	via, err = readNode(r)
	if err != nil {
		if err == io.EOF {
			err = fmt.Errorf("Got EOF before link VIA could be read.")
		}
		return
	}

	to, err = readNode(r)
	if err != nil {
		if err == io.EOF {
			err = fmt.Errorf("Got EOF before link TO could be read.")
		}
		return
	}

	return
}


