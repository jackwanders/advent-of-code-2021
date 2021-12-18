const {
  parseInput,
} = require('../util');

/**
 * Left pad string s with character c so that the resulting string
 * has length l
 * 3/22/2016 NEVER FORGET
 */
const leftpad = (s, c, l) => `${(new Array(l-s.length).fill(c)).join('')}${s}`;

/**
 * Create an iterator for reading the bit string
 *
 * I'd have preferred to use a generator, but
 * the way generator based iterators handle the next()
 * parameter is wonky
 */
const makeBitIterator = (str) => {
  let end = str.length;
  return {
    done: false,
    index: 0,
    next: function(bitsToRead) {
      result = {
        value: str.substr(this.index, Math.min(bitsToRead, str.length - this.index)),
        done: this.index + bitsToRead >= end,
      };
      this.done = result.done;
      this.index += bitsToRead;
      return result;
    }
  }
};

const bits = parseInput(__dirname, raw => raw
  .split('')
  .map(c => parseInt(c, 16).toString(2)) // convert each hexadecimal character to decimal, then to binary
  .map(b => leftpad(b, '0', 4)) // pad each binary string so that it has four characters, left padded with '0'
  .join('')
);

const it = makeBitIterator(bits);
const packets = [];

/**
 * Read a single packet of data from the bit iterator.
 * May include recursive calls for sub-packets
 */
const readPacket = () => {
  const packet = {
    version: parseInt(it.next(3).value, 2),
    type: parseInt(it.next(3).value, 2),
    value: null,
  };

  switch (packet.type) {
    // Literal value
    // Read 5 bit words until lead bit is zero
    case 4:
      let word;
      let valueString = '';
      do {
        word = it.next(5).value;
        valueString += word.substring(1);
      } while (word.charAt(0) === '1');
      packet.value = parseInt(valueString, 2);
      packets.push(packet);
      break;

    // Operator packets
    // Read length bit, operate accordingly
    default:
      const lengthType = parseInt(it.next(1).value, 2);
      switch (lengthType) {
        // Read packets until we have iterated through
        // the appropriate number of bits
        case 0:
          const subPacketLength = parseInt(it.next(15).value, 2);
          const currentIndex = it.index;
          packets.push(packet);
          do {
            readPacket();
          } while (it.index < currentIndex + subPacketLength);
          break;

        // Read the specified number of packets, regardless of length
        case 1:
          const numSubPackets = parseInt(it.next(11).value, 2);
          packets.push(packet);
          for (let p = 0; p < numSubPackets; p++) {
            readPacket();
          }
          break;
      }
  }
}

do {
  readPacket();
} while (!it.done)

console.log(packets.reduce((sum, p) => sum + p.version, 0));