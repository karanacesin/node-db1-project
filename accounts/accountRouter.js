const express = require("express");

const db = require("../data/dbConfig.js");

const router = express.Router();

router.get("/", (req, res) => {
    
    db.select("*")
        .from("accounts")
        .then(accounts => {
            res.status(200).json({ data: accounts });
        })
        .catch(err => {
            handleError(err, res);
        });
});

router.get("/:id", (req, res) => {
    const { id } = req.params;

    db.select("*")
        .from("accounts")
        .where({ id })
        .first()
        .then(account => {
            res.status(200).json({ data: account });
        })
        .catch(err => {
            handleError(err, res);
        });
});

router.post("/", (req, res) => {
    const account = req.body;

    db("accounts")
        .insert(account, "id")
        .then(id => {
            db("accounts")
                .where({ id: id[0] })
                .first()
                .then(account => {
                    res.status(200).json({ data: account });
                });
        })
        .catch(err => {
            handleError(err, res);
        });
});

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const update = req.body;

    db("accounts")
        .where({ id })
        .update(update) 
        .then(count => {
            if (count > 0) {
                res.status(200).json({ data: count });
            } else {
                res.status(404).json({ message: "there was no record to update" });
            }
        })
        .catch(err => {
            handleError(err, res);
        });
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db("accounts")
        .where({ id })
        .del()
        .then(count => {
            if (count > 0) {
                res.status(200).json({ data: count });
            } else {
                res.status(404).json({ message: "there was no record to delete" });
            }
        })
        .catch(err => {
            handleError(err, res);
        });
});

function handleError(err, res) {
    console.log("error", err);
    res.status(500).json({ message: err.message });
}

module.exports = router;