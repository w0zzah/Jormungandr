def checksum(header):
    if len(header) < 20:
        raise ValueError("head")
    if len(header) % 4 != 0:
        raise ValueError("4mod")

    x = 0
    for i in range(0, len(header), 2):
        word = (header[i] << 8) + header[i + 1]
        x += word

    while x > 0xFFFF:
        lowest16 = x & 0xFFFF
        carry = x >> 16
        x = lowest16 + carry

    var = ~x & 0xFFFF
    return var


# Optional standalone checksum tests:
# empty_checksum_header = bytearray([0x45, 0x0, 0x0, 0x1e, 0x4, 0xd2, 0x0, 0x0, 0x40, 0x6, 0x0, 0x0, 0x12, 0x34, 0x56, 0x78, 0x98, 0x76, 0x54, 0x32])
# print(checksum(empty_checksum_header))

# header1 = bytearray([0x45, 0x0, 0x0, 0x1e, 0x4, 0xd2, 0x0, 0x0, 0x40, 0x6, 0x20, 0xb4, 0x12, 0x34, 0x56, 0x78, 0x98, 0x76, 0x54, 0x32])
# print(checksum(header1))


def basic_packet_check(packet):
    # check size, check version num, check 
    if len(packet) < 20:
        raise ValueError("Packet does not contain a full IP header")

    version = packet[0] >> 4
    if version != 4:
        raise ValueError("Packet version number must equal 4")

    header_len = packet[0] & 0x0F
    if header_len < 5:
        raise ValueError("Packet hdrlen field must be at least 5")

    header_length_bytes = header_len * 4
    if len(packet) < header_length_bytes:
        raise ValueError("Packet does not contain a full IP header")

    total_length = (packet[2] << 8) + packet[3]
    if total_length != len(packet):
        raise ValueError("Packet totallength field is inconsistent with the packet length")

    header = packet[:header_length_bytes]
    if checksum(header) != 0:
        raise ValueError("Packet checksum failed")

    return True

pkt3 = bytearray([0x45, 0x0, 0x0, 0x1b, 0x12, 0x67, 0x20, 0xe, 0x20, 0x6, 0x35, 0x58, 0x66, 0x66, 0x44, 0x44, 0x55, 0x44, 0x33, 0x22, 0x11, 0x0, 0x01, 0x02, 0x03, 0x04, 0x05])
print(basic_packet_check(pkt3))