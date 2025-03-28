import bank from "models/bank";

export async function putHandler(req, res) {
  const query = req.query;
  const bankId = parseInt(query.bankId);
  const body = req.body;

  const result = await bank.update(bankId, body.name);
  return res.status(200).json(result);
}

export async function deleteHandler(req, res) {
  const query = req.query;
  const bankId = parseInt(query.bankId);

  const result = await bank.remove(bankId);
  if (result.statusCode === 404) {
    return res.status(result.statusCode).json(result);
  }
  return res.status(result.statusCode).json(result);
}

export default function handler(req, res) {
  if (req.method === "PUT") return putHandler(req, res);
  if (req.method === "DELETE") return deleteHandler(req, res);
}
