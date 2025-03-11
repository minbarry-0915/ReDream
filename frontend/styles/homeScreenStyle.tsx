import {StyleSheet} from 'react-native';

const HomeScreenStyles = StyleSheet.create({
  content: {
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 36,
  },
  bookListContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookListHeaderContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  bookListEditButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookListContent: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  bookListImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#969696',
    marginRight: 12,
  },
  bookListImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  bookListTextContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

export default HomeScreenStyles;
