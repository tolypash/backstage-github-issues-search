import React from 'react';
import { IndexableDocument } from '@backstage/search-common';
import { ListItem, ListItemText, Divider } from '@material-ui/core';
import { Link } from '@backstage/core-components';

type Props = {
  result: IndexableDocument;
};

export const IssueResultListItem = ({ result }: Props) => {
  return (
    <Link to={result.location}>
      <ListItem alignItems="flex-start">
        <ListItemText
          primaryTypographyProps={{ variant: 'h6' }}
          primary={result.title}
          secondary={result.text}
          style={{
              
          }}
        />
      </ListItem>
      <Divider />
    </Link>
  );
};