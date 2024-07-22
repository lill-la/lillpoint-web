import React, {useState} from "react";
import CardInfo from "../types/CardInfo";
import Date8 from "../types/Date8";
import {sendDiscordMessage} from "../utils/Discord";

function Add() {
  const [message, setMessage] = useState('');

  const sign = async (event: React.FormEvent<HTMLFormElement>) => {
    setMessage('');

    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const inputPoint = form.get("point") as string || "0";
    const inputPrivateKey = form.get("privateKey") as string || "";

    const addPoint = parseInt(inputPoint);
    const privateKey = await window.crypto.subtle.importKey('jwk', JSON.parse(inputPrivateKey), {
      name: 'ECDSA',
      namedCurve: 'P-256'
    }, false, ['sign']);

    let isValidInput = true;
    let errStr = '';
    if (0 > addPoint) {
      errStr += "Invalid Point: " + inputPoint + '\n';
      isValidInput = false;
    }
    if (!isValidInput) {
      setMessage(errStr);
      return;
    }

    const ndef = new NDEFReader();

    setMessage('reading...');

    await ndef.scan();

    ndef.onreading = async (e) => {
      try {
        const record = e.message.records[0];
        if (record.recordType !== 'url') {
          setMessage('recordType is not url');
          return;
        }
        const decoder = new TextDecoder();
        const data = decoder.decode(record.data);
        if (!data.startsWith('https://pt.lill.la/v1/r?')) {
          setMessage('record url not start with https://pt.lill.la/v1/r?')
          return;
        }
        const paramStr = data.replace('https://pt.lill.la/v1/r?', '');
        const params = new URLSearchParams(paramStr);
        const id = params.get('id');
        const name = params.get('name');
        const point = params.get('point');
        const first = params.get('first');
        const last = params.get('last');
        const sign = params.get('sign');
        if (id == null || name == null || point == null || first == null || last == null || sign == null) {
          setMessage('params contains null');
          return;
        }
        const publicKeyJwk = {
          "crv": "P-256",
          "ext": true,
          "key_ops": ["verify"],
          "kty": "EC",
          "x": "yC0nMFLBCUaXnN3aixEQKLMv1eZBbp7WP10B9mumIwc",
          "y": "-jV6B_Ogb8VAAuRLHVTUi18xhv-12F_fdaCnC0bzNbM"
        };
        const publicKey = await window.crypto.subtle.importKey('jwk', publicKeyJwk, {
          name: 'ECDSA',
          namedCurve: 'P-256'
        }, false, ['verify']);

        const cardInfo = new CardInfo(id, decodeURI(name), point, first, last, sign);
        const isValid = await cardInfo.verify(publicKey);

        if (!isValid) {
          setMessage('invalid');
          return;
        }

        const newPoint = cardInfo.point.toNumber() + addPoint;
        const newLast = new Date8(new Date());

        const newCardInfo = await CardInfo.build(cardInfo.id, cardInfo.name, newPoint, cardInfo.first, newLast, privateKey);

        const ndef = new NDEFReader();

        setMessage('writing...')

        const newData: string = 'https://pt.lill.la/v1/r?' + newCardInfo.toParams().toString();

        await ndef.write({
          records: [
            {
              recordType: 'url',
              data: newData,
            }
          ]
        })

        setMessage('finished!');

        await sendDiscordMessage('Add (read)', data + '\n' + newData, id, name, point, first, last, sign, isValid);
      } catch (e: any) {
        setMessage(e.toString() + e.message);
      }
    }
  }

  return (
    <div className='h-max flex flex-col items-center justify-center'>
      <form onSubmit={sign} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <div className='mb-6 text-gray-700 text-xl font-bold'>
          Add
        </div>
        <div className='mb-4'>
          <label htmlFor='point' className='block text-gray-700 text-sm font-bold mb-2'>
            Point
          </label>
          <input type='number' name='point' id='point' defaultValue='0'
                 className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
        </div>
        <div className='mb-4'>
          <label htmlFor='privateKey' className='block text-gray-700 text-sm font-bold mb-2'>
            PrivateKey
          </label>
          <input type='password' name='privateKey' id='privateKey' defaultValue=''
                 className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
        </div>
        <input type='submit' value='Add Point'
               className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'/>
        <div className='mt-4'>
          {message}
        </div>
      </form>
    </div>
  )
}

export default Add;