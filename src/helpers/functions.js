async function waitToCreate() {
  return await new Promise((resolve) => setTimeout(resolve, 50));
}

const helperFunctions = {
  waitToCreate,
};

export default helperFunctions;
