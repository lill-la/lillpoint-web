import {useEffect, useState} from "react";
import CardInfo from "../types/CardInfo";

function Read() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [point, setPoint] = useState(0);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    (async () => {
      const searchParams = new URLSearchParams(window.location.search);

      const id = searchParams.get('id');
      const name = searchParams.get('name');
      const point = searchParams.get('point');
      const first = searchParams.get('first');
      const last = searchParams.get('last');
      const sign = searchParams.get('sign');

      if (id == null || name == null || point == null || first == null || last == null || sign == null) {
        return;
      }

      console.log(id);

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

      const cardInfo = new CardInfo(id, name, point, first, last, sign);
      const isValid = await cardInfo.verify(publicKey);

      setId(cardInfo.id.toString());
      setName(cardInfo.name.toString());
      setPoint(cardInfo.point.toNumber());
      setValid(isValid);
    })()
  }, []);

  return (
    <div>
      {!valid ? (
        <div>
          NO
        </div>
      ) : (
        <div>
          <div>
            {id}
          </div>
          <div>
            {name}
          </div>
          <div>
            {point}
          </div>
        </div>
      )
      }
    </div>
  )
}

export default Read;