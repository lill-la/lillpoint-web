import {useEffect, useState} from "react";
import CardInfo from "../types/CardInfo";
import {sendDiscordMessage} from "../utils/Discord";

function Read() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [point, setPoint] = useState(0);
  const [valid, setValid] = useState(false);

  const [rank, setRank] = useState('');
  const [nextRank, setNextRank] = useState('');
  const [nextPoint, setNextPoint] = useState(0);

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

      const p = cardInfo.point.toNumber();
      if (p < 500) {
        setRank('ブロンズ');
        setNextPoint(500 - p);
        setNextRank('シルバー');
      } else if (p < 1500) {
        setRank('シルバー');
        setNextPoint(1500 - p);
        setNextRank('ゴールド');
      } else if (p < 3000) {
        setRank('ゴールド');
        setNextPoint(3000 - p);
        setNextRank('プラチナ');
      } else if (p < 5000) {
        setRank('プラチナ');
        setNextPoint(5000 - p);
        setNextRank('ダイヤモンド');
      } else {
        setRank('ダイヤモンド');
        setNextPoint(-1);
        setNextRank('');
      }

      setId(cardInfo.id.toString());
      setName(cardInfo.name.toString());
      setPoint(cardInfo.point.toNumber());
      setValid(isValid);

      await sendDiscordMessage('Read', window.location.href, id, name, point, first, last, sign, isValid);
    })()
  }, []);

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='text-center'>
        <div className='text-6xl'>
          {point} pt.
        </div>
        {valid ? <div/> : <div>検証失敗</div>}
        <div className='text-2xl mt-10'>
          {rank}会員
        </div>
        {nextPoint > 0 &&
          <div className='text-sm'>
            あと{nextPoint}ptで{nextRank}会員です
          </div>
        }
        <div className='text-xl mt-6'>
          No. {id}
        </div>
        <div className='text-2xl'>
          {name}
        </div>
      </div>
    </div>
  )
}

export default Read;