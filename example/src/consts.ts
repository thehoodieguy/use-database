export const routes = {
  list: '/',
  detail: '/:id',
  detailCreator: (id: number) => `/${id}`,
};
