import express from "express";

const checkRouter = express.Router();
/**
 * GET /check
 * Check endpoint
 */
checkRouter.get('/', (req, res) => {
    try {
        res.send('Heehe boi');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

export default checkRouter;
