const source = new EventSource('/__dev_server');

source.onmessage = (event) => {
  switch (event.data) {
    case 'refresh':
      source.close();
      location.reload();
      break;
    case 'update':
      console.log('code updated. Will refresh after build.');
      break;
  }
};
