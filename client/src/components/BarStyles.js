import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 500,
    margin: '0 auto',
    backgroundColor: '#F1F1F1',
    marginBottom: '10px',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    backgroundColor: '#F1F1F1',
    fontFamily: 'Comfortaa',
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  logInButton: {
    // backgroundColor: '#E8ECF2',
    width: '500px',
    marginTop: '10px',
  },
  goButton: {
    backgroundColor: '#E8ECF2',
    width: '100px',
  },
}));

export default useStyles;
