import React from 'react';
import { ListItem, ListItemAvatar, ListItemText, Divider, makeStyles } from '@material-ui/core';
import { Avatar, Box, Chip } from '@material-ui/core';
import { Link } from '@backstage/core-components';

type Props = {
  result: any;
};

const useStyles = makeStyles({
  lineClamp: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 3,
    "-webkit-box-orient": "vertical"
  },
  flexContainer: {
    flexWrap: 'wrap',
  },
  itemText: {
    width: '100%',
    marginBottom: '1rem',
  },
})

export const IssueResultListItem = ({ result }: Props) => {
  const classes = useStyles()

  return (
    <Link to={result.location}>
      <ListItem alignItems="flex-start" className={classes.flexContainer}>
        <ListItemAvatar>
          <Avatar
            src={result.user.avatar_url}
            alt={result.user.login}
          />
        </ListItemAvatar>
        <ListItemText
          className={classes.itemText}
          primaryTypographyProps={{ variant: 'h6' }}
          primary={result.title}
          secondary={result.text}
          secondaryTypographyProps={{
            className: classes.lineClamp
          }}
        />
        <Box>
          <Chip
            label={result.state}
            size="small"
            style={{
              backgroundColor: result.state === "open" ? "#238636" : "#8957e5",
              color: '#fff'
            }}
          />
        </Box>
      </ListItem>
      <Divider />
    </Link>
  );
};