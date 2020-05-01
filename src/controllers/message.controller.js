const Message = require('../models/message.model');

const messageController = {};


// GET all the previous messages
messageController.get_message = (req, res) => {   
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));
     
    Message.find({'document': params.id}).exec((err, messages) => {
        if (err) {
            res.send(err).status(500);
        } else {
            res.send(messages).status(200);
        }
    });
};

// POST a new message
messageController.post_message = (req, res) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));

    message_body = {
        sender: body.sender,
        content: body.content.toString(),
        document: body.document
    }
    Message.create(message_body).then((message) => {
        res.send(message).status(200);
    }).catch((err) => {
        console.log(err);
        res.send(err).status(500);
    });
};

module.exports = messageController;