export const testPostController = (req, res) => {
    
  const { name } = req.body;

  res.status(201).send(`ypur name is ${name}`);
};
