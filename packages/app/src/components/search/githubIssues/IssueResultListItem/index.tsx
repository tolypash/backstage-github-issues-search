import React from 'react';
import { ListItem, ListItemAvatar, ListItemText, Divider, makeStyles } from '@material-ui/core';
import { Avatar } from '@material-ui/core';
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
  }
})

export const IssueResultListItem = ({ result }: Props) => {
  const classes = useStyles()
  return (
    <Link to={result.location}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar src={result.user.avatar_url} />
        </ListItemAvatar>
        <ListItemText
          primaryTypographyProps={{ variant: 'h6' }}
          primary={result.title}
          secondary={result.text}
          secondaryTypographyProps={{
            className: classes.lineClamp
          }}
        />
      </ListItem>
      <Divider />
    </Link>
  );
};