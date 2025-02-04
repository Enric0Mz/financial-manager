import prisma from "@infra/database";

export default async function putHandler(req, res) {
  const query = req.query;
  const bankId = parseInt(query.bankId);
  const body = JSON.parse(req.body);
  const name = body.name;

  const result = await prisma.bank.update({
    where: {
      id: bankId,
    },
    data: {
      name,
    },
  });
  return res.status(200).json(result);
}
