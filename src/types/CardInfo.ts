import Id from "./Id";
import Name from "./Name";
import Point from "./Point";
import {First} from "./First";
import {Last} from "./Last";
import Date8 from "./Date8";
import {Sign} from "./Sign";
import {buf2hex, hex2buf} from "@taquito/utils";

export default class CardInfo {
  id: Id;
  name: Name;
  point: Point;
  first: First;
  last: Last;
  sign: Sign;

  constructor(
    id: Id | string | number,
    name: Name | string,
    point: Point | string | number,
    first: First | string,
    last: Last | string,
    sign: Sign | string,
  ) {
    this.id = (typeof id === 'string' || typeof id === 'number') ? new Id(id) : id;
    this.name = (typeof name === 'string') ? new Name(name) : name;
    this.point = (typeof point === 'string' || typeof point === 'number') ? new Point(point) : point;
    this.first = (typeof first === 'string') ? new Date8(first) : first;
    this.last = (typeof last === 'string') ? new Date8(last) : last;
    this.sign = sign;
  }

  public static async build(
    id: Id | string | number,
    name: Name | string,
    point: Point | string | number,
    first: First | string,
    last: Last | string,
    privateKey: CryptoKey
  ) {
    const _id = (typeof id === 'string' || typeof id === 'number') ? new Id(id) : id;
    const _name = (typeof name === 'string') ? new Name(name) : name;
    const _point = (typeof point === 'string' || typeof point === 'number') ? new Point(point) : point;
    const _first = (typeof first === 'string') ? new Date8(first) : first;
    const _last = (typeof last === 'string') ? new Date8(last) : last;

    const str = _id.toString() + _name.toString() + _point.toString() + _first.toString() + _last.toString();
    const strArray = new TextEncoder().encode(str);

    const sign = await window.crypto.subtle.sign({name: 'ECDSA', hash: 'SHA-256'}, privateKey, strArray);

    return new CardInfo(_id, _name, _point, _first, _last, buf2hex(new Uint8Array(sign)));
  }

  async updateSign(privateKey: CryptoKey) {
    const str = this.id.toString() + this.name.toString() + this.point.toString() + this.first.toString() + this.last.toString();
    const strArray = new TextEncoder().encode(str);
    const sign = await window.crypto.subtle.sign({name: 'ECDSA', hash: 'SHA-256'}, privateKey, strArray);
    this.sign = buf2hex(new Uint8Array(sign));
  }

  async verify(publicKey: CryptoKey): Promise<boolean> {
    const str = this.id.toString() + this.name.toString() + this.point.toString() + this.first.toString() + this.last.toString();
    const strArray = new TextEncoder().encode(str);
    return await window.crypto.subtle.verify({name: 'ECDSA', hash: 'SHA-256'}, publicKey, hex2buf(this.sign), strArray);
  }

  toParams(): URLSearchParams {
    return new URLSearchParams({
      id: this.id.toString(),
      name: encodeURI(this.name.toString()),
      point: this.point.toString(),
      first: this.first.toString(),
      last: this.last.toString(),
      sign: this.sign
    });
  }
}