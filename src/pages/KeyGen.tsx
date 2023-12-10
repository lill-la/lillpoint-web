import React, {useState} from "react";

function KeyGen() {
  const [privateKey, setPrivateKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const generate = async (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    const keyPair = await window.crypto.subtle.generateKey({
      name: 'ECDSA',
      namedCurve: 'P-256'
    }, true, ['sign', 'verify']);
    const privateKey = await window.crypto.subtle.exportKey('jwk', keyPair.privateKey);
    const publicKey = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey);
    setPrivateKey(JSON.stringify(privateKey));
    setPublicKey(JSON.stringify(publicKey));
  }

  const copyPrivateKey = () => {
    navigator.clipboard.writeText(privateKey).then(r => {
    });
  }

  const copyPublicKey = () => {
    navigator.clipboard.writeText(publicKey).then(r => {
    });
  }

  return (
    <div className='h-max flex flex-col items-center justify-center'>
      <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <div className='mb-2 text-gray-700 text-xl font-bold'>
          KeyGen
        </div>
        <button onClick={generate}
                className='mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
          Generate
        </button>
        <div className='mb-4'>
          <div className='block text-gray-700 text-sm font-bold mb-2'>
            PrivateKey
          </div>
          <textarea readOnly value={privateKey} spellCheck='false'
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
          <button onClick={copyPrivateKey}
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
            Copy
          </button>
        </div>
        <div className='mb-4'>
          <div className='block text-gray-700 text-sm font-bold mb-2'>
            PublicKey
          </div>
          <textarea readOnly value={publicKey} spellCheck='false'
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
          <button onClick={copyPublicKey}
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}

export default KeyGen;