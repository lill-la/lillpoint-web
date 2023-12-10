import React, {useState} from "react";
import CardInfo from "../types/CardInfo";
import Date8 from "../types/Date8";

function New() {
  const [message, setMessage] = useState('');

  const sign = async (event: React.FormEvent<HTMLFormElement>) => {
    setMessage('');

    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const inputId = form.get("id") as string || "0";
    const inputName = form.get("name") as string || "";
    const inputPoint = form.get("point") as string || "0";
    const inputPrivateKey = form.get("privateKey") as string || "";

    const id = parseInt(inputId);
    const name = inputName;
    const point = parseInt(inputPoint);
    const first = new Date8(new Date());
    const last = new Date8(new Date());
    const privateKey = await window.crypto.subtle.importKey('jwk', JSON.parse(inputPrivateKey), {
      name: 'ECDSA',
      namedCurve: 'P-256'
    }, false, ['sign']);

    let isValidInput = true;
    let errStr = '';
    if (0 > id || id > 999999) {
      errStr += "Invalid Id: " + inputId + '\n';
      isValidInput = false;
    }
    if (1 > name.length || name.length > 16) {
      errStr += "Invalid Name: " + inputName + '\n';
      isValidInput = false;
    }
    if (0 > point) {
      errStr += "Invalid Point: " + inputPoint + '\n';
      isValidInput = false;
    }
    if (!isValidInput) {
      setMessage(errStr);
      return;
    }

    const cardInfo = await CardInfo.build(id, name, point, first, last, privateKey);

    setMessage('writing...')

    const ndef = new NDEFReader();

    await ndef.write({
      records:[
        {
          recordType: 'url',
          data: 'https://pt.lill.la/v1/r?' + cardInfo.toParams().toString()
        }
      ]
    });

    setMessage('finished!')
  }

  return (
    <div className='h-max flex flex-col items-center justify-center'>
      <form onSubmit={sign} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <div className='mb-6 text-gray-700 text-xl font-bold'>
          New
        </div>
        <div className='mb-4'>
          <label htmlFor='id' className='block text-gray-700 text-sm font-bold mb-2'>
            Id
          </label>
          <input type='number' name='id' id='id' defaultValue=''
                 className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
        </div>
        <div className='mb-4'>
          <label htmlFor='name' className='block text-gray-700 text-sm font-bold mb-2'>
            Name
          </label>
          <input type='text' name='name' id='name' defaultValue=''
                 className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
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
        <input type='submit' value='Create New'
               className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'/>
        <div className='mt-4'>
          {message}
        </div>
      </form>
    </div>
  )
}

export default New;