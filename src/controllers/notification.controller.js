const Notification = require('../models/notification.model');
const Permision = require('../models/permision.model')
const notificationController = {};

notificationController.get_notifications = async (req, res, next) => {
    await Notification.find().populate('document').populate('forPermisions').populate('toUser')
        .then(notifyMessages => {
            var notifications, requests;

            notifications = new Array();
            requests = new Array();

            notifyMessages.forEach((notify) => {
                if (req.user && notify.toUser && req.user._id.toString() == notify.toUser._id.toString()) {
                    notifications.push(notify);
                } else {
                    if (req.user && notify.forPermisions && req.user._id.toString() == notify.forPermisions._id.toString() && notify.notificationSied == false) {
                        requests.push(notify);
                    }
                }
            })
            res.status(200).json({
                notifications: notifications,
                requests: requests
            })

        })
        .catch(err => res.status(400).json(err));
};

notificationController.post_notification = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));

    await Notification.create(body)
        .then(notification => res.status(200).json(notification))
        .catch(err => res.status(400).json(err));
};


notificationController.updateNotificationDocVersion = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));

    await Notification.updateOne({
            notificationSied: false,
            document: query.document,
            document_version: query.version
        }, {
            $set: {
                notificationSied: true
            }
        })
        .then(notification => res.status(200).json(notification))
        .catch(err => res.status(400).json(err))

}

notificationController.updateNotificationForPermisions = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));

    await Notification.updateOne({
            notificationSied: false,
            document: params.id,
        }, {
            $set: {
                notificationSied: true
            }
        })
        .then(notification =>
            Permision.updateOne({
                requestAcepted: false,
                document: params.id,
            }, {
                $set: {
                    requestAcepted: true
                }
            })
        )
        .catch(err => res.status(400).json(err))

}

notificationController.updateAllStatus = async (req, res) => {
    await Notification.update({
        toUser: req.user._id
    }, {
        '$set': {
            notificationSied: true
        }
    }, {
        multi: true
    }).then(notifications => {
        res.status(200).json(notifications)
    }).catch(err => res.status(400).json(err))
}

notificationController.get_notificationNumber = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));

    let countToUser = ''
    await Notification.find({
        toUser: req.user._id
    }).then(notificationToUser => {
        notificationToUser.map(notifyUser => {
            if (notifyUser.notificationSied == false)
                countToUser = countToUser + 1
        })
    })

    res.status(200).json(countToUser)
}

notificationController.get_requestNumber = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));

    let countForPermisions = ''

    await Notification.find({
        forPermisions: req.user._id
    }).then(notificationForPermisions => {
        notificationForPermisions.map(notifyPermisions => {
            if (notifyPermisions.notificationSied == false)
                countForPermisions = countForPermisions + 1
        })
    })

    res.status(200).json(countForPermisions)
}

notificationController.delete_notification = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));

    await Notification.findOneAndRemove({
            forPermisions: req.user._id,
            document: params.id
        }).then(notification => {
            Permision.findOneAndRemove({
                withPermisions: req.user._id,
                requestAcepted: false,
                document: params.id
            }).then(permision =>
                res.status(200).send(permision)
            )
            res.status(200).send(notification)
        })
        .catch(err => res.status(400).json(err))
}


module.exports = notificationController;