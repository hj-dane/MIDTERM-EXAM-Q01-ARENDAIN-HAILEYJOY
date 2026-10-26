const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

const requests = require('./data.json');

app.get("/api/requests", (req, res) => {
    res.json(requests);
});

app.get("/api/requests/:id", (req, res) => {
    const id = Number(req.params.id);
    const request = requests.find(request => request.id === id);

    if(!request){
        return res.status(404).json({
            message: "Request ID not found"
        })
    }
});

app.post("/api/requests", (req, res) => {
    const {requester, location, problem, priority} = req.body;

    if(!requester || !location || !problem || !priority){
        return res.status(400).json({
            message: "Requester, location, problem and priority are required."
        })
    }

    const newId = requests.length ? Math.max(...requests.map(m => m.id)) + 1 : 1;

    const newRequest = {id: newId, requester, location, problem, priority, status: "Pending" };
    
    requests.push(newRequest);

    res.status(201).json(newRequest);
});

app.delete("/api/requests/:id", (req, res) => {
    const requestId = Number(req.params.id);
    const requestIndex = requests.findIndex(request => request.id === requestId);

    if(requestIndex === -1){
        return res.status(404).json({
            message: "Request ID not found"
        });
    }

    requests.splice(requestIndex, 1);

    res.status(200).json({
        message: `Request ID: ${requestId} deleted successfully.`
    });
});

app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

