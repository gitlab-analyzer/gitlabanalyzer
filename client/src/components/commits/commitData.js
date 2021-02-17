const fakeData = [
  {
    avatar: 'https://uifaces.co/our-content/donated/4NbH-5h3.jpg',
    username: '@jwayne',
    fullname: 'Jean Wayne',
    title: 'Fix data fetch method and add infinity scroll',
    date: '2021-01-29',
    commitId: '9228f2d5',
  },
  {
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    username: '@schan',
    fullname: 'Sara Chan',
    title:
      'Add functionality to embedd codes in reviews page and sync automatically',
    date: '2021-01-27',
    commitId: '1228f2d5',
  },
  {
    avatar: 'https://randomuser.me/api/portraits/men/35.jpg',
    username: '@aroberts',
    fullname: 'Alex Roberts',
    title: 'Create new api route for fetching user and commits data',
    date: '2021-01-22',
    commitId: '9228f2d5',
  },
  {
    avatar: 'https://uifaces.co/our-content/donated/LgPx_hOQ.jpg',
    username: '@swilliams',
    fullname: 'Shane Williams',
    title: 'Fix data fetch method and add infinity scroll',
    date: '2021-01-21',
    commitId: '9228f2d5',
  },
  {
    avatar: 'https://uifaces.co/our-content/donated/LgPx_hOQ.jpg',
    username: '@swilliams',
    fullname: 'Shane Williams',
    title: 'Fix data fetch method and add infinity scroll',
    date: '2021-01-20',
    commitId: '5228f2d5',
  },
];

const usernames = ['jwayne', 'schan', 'arobert', 'bchung', 'swilliams'];

export const fetchData = () => {
  return fakeData;
};

export const fetchNames = () => {
  return usernames;
};
