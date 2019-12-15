export const routes = {
  list: '/',
  detail: '/:id',
  detailCreator: (id: string) => `/${id}`,
};

export const apiEndpoints = {
  list: `http://www.mocky.io/v2/5df637383400009d17e5a546`,
  detail: (id: string) => `/${id}`,
};
