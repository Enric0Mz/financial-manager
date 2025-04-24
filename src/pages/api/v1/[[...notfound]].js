export default function handler(req, res) {
  return res.status(404).json({
    name: "not found",
    message: `route ${req.url} does not exist`,
    statusCode: 404,
  });
}
