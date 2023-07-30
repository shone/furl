package main

import (
	"encoding/binary"
	"io"
	"fmt"
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

func writeNode(w io.Writer, b []byte) error {
	// TODO: Allow writing zero-sized nodes
	bytesWritten := 0
	for bytesWritten < len(b) {
		packetSize := len(b) - bytesWritten
		if packetSize > MAX_PACKET_SIZE {
			packetSize = MAX_PACKET_SIZE
			err := binary.Write(w, binary.BigEndian, PACKET_CONTINUATION)
			if err != nil {
				return err
			}
		}
		err := binary.Write(w, binary.BigEndian, uint16(packetSize))
		if err != nil {
			return err
		}
		_, err = w.Write(b[bytesWritten:bytesWritten+packetSize])
		if err != nil {
			return err
		}
		bytesWritten += packetSize
	}
	return nil
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
				return []byte{}, fmt.Errorf("Invalid packet: read two continuation markers in a row")
			}
		}

		packet := make([]byte, packetSize)
		if packetSize > 0 {
			_, err := io.ReadFull(r, packet)
			if err != nil {
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

func writeLink(w io.Writer, from, via, to []byte) error {
	err := writeNode(w, from)
	if err != nil {
		return err
	}

	err = writeNode(w, via)
	if err != nil {
		return err
	}

	err = writeNode(w, to)
	if err != nil {
		return err
	}

	return nil
}

func writeLinks(w io.Writer, links [][3][]byte) error {
	for i, link := range links {
		err := writeLink(w, link[0], link[1], link[2])
		if err != nil {
			return fmt.Errorf("Error writing %d of %d links: %s", i+1, len(links), err)
		}
	}
	return nil
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


