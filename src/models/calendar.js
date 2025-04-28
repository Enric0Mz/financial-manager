import year from "./year";
import month from "./month";
import yearMonth from "./yearMonth";
import { httpSuccessCreated } from "helpers/httpSuccess";

async function create() {
  const yearsList = await year.bulkCreate();
  const monthsList = await month.bulkCreate();
  const result = await yearMonth.connect(yearsList, monthsList);

  return new httpSuccessCreated(
    "months created for years 1950 to 2050",
    result,
  );
}

const calendar = {
  create,
};

export default calendar;
