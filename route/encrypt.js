const router = require('express').Router();
const crypto = require('crypto');
const Buffer = require('buffer');
let algorithm = "aes-256-cbc";

router.get('', async (req, res) => {
    res.render('index', {
    })
});



router.post('/encrypt', async (req, res) => {
    try {
        let { key, secretiv, text, id } = req.body;
        if (id === '1') {
            if (typeof text === 'object') {
                text = JSON.stringify(text);
            }
            let keystring = crypto.createHash('sha256').update(String(key)).digest('hex').substr(0, 32);
            let ivv = crypto.createHash('sha256').update(String(secretiv)).digest('hex').substr(0, 16);
            const cipher = crypto.createCipheriv(algorithm, keystring, ivv);
            const encrypted = cipher.update(text, 'utf8', 'base64') + cipher.final('base64');
            res.render('index', {
                key: key,
                iv: secretiv,
                text: text,
                encryptedText: encrypted
            })
        }
        else {
            text = text ? text.toString().replace(" ", "+") : "";
            try {
                let buff = Buffer.from(text, 'base64');
                let text = buff.toString('ascii');

                let keystringBuffer = crypto.createHash('sha256').update(String(key)).digest('hex').substr(0, 32);
                let ivvBuffer = crypto.createHash('sha256').update(String(secretiv)).digest('hex').substr(0, 16);

                let decipherBuffer = crypto.createDecipheriv(algorithm, keystringBuffer, ivvBuffer)

                let decBuffer = decipherBuffer.update(text, "base64", 'utf8')
                decBuffer += decipherBuffer.final();
                res.render('index', {
                    key: key,
                    iv: secretiv,
                    text: text,
                    encryptedText: decBuffer
                });
            } catch {
                try {
                    let keystring = crypto.createHash('sha256').update(String(key)).digest('hex').substr(0, 32);
                    let ivv = crypto.createHash('sha256').update(String(secretiv)).digest('hex').substr(0, 16);

                    let decipher = crypto.createDecipheriv(algorithm, keystring, ivv)

                    let dec = decipher.update(text, "base64", 'utf8')
                    dec += decipher.final();
                    // return dec
                    try {
                        res.render('index', {
                            key: key,
                            iv: secretiv,
                            text: text,
                            encryptedText: JSON.parse(dec)
                        })
                    }
                    catch {
                        res.render('index', {
                            key: key,
                            iv: secretiv,
                            text: text,
                            encryptedText: dec
                        })
                    }
                } catch {
                    res.render('index', {
                        key: key,
                        iv: secretiv,
                        text: text,
                        encryptedText: JSON.stringify(text)
                    })
                }
            }
        }
    } catch (e) {
        console.log('encrypt', e);
    }
}
)



module.exports = router;


