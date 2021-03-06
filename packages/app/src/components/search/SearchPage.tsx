import React from 'react';
import { makeStyles, Theme, Grid, List, Paper } from '@material-ui/core';

import { CatalogResultListItem } from '@backstage/plugin-catalog';
import { DocsResultListItem } from '@backstage/plugin-techdocs';
import { IssueResultListItem } from './githubIssues';

import {
  SearchBar,
  SearchFilter,
  SearchResult,
  SearchType,
  DefaultResultListItem,
  useSearch,
} from '@backstage/plugin-search';
import { Content, Header, Page } from '@backstage/core-components';

const useStyles = makeStyles((theme: Theme) => ({
  bar: {
    padding: theme.spacing(1, 0),
  },
  filters: {
    padding: theme.spacing(2),
  },
  filter: {
    '& + &': {
      marginTop: theme.spacing(2.5),
    },
  },
}));

const SearchPage = () => {
  const classes = useStyles();
  const { types, filters, setFilters } = useSearch()

  React.useEffect(() => {
    if (!types.includes('github-issue')) { // remove status filter if github-issue type not selected
      setFilters({
        ...filters,
        state: undefined
      })
    }
  }, [types])

  return (
    <Page themeId="home">
      <Header title="Search" />
      <Content>
        <Grid container direction="row">
          <Grid item xs={12}>
            <Paper className={classes.bar}>
              <SearchBar debounceTime={100} />
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.filters}>
              <SearchType
                values={['techdocs', 'software-catalog', 'github-issue']}
                name="type"
                defaultValue="software-catalog"
              />
              <SearchFilter.Select
                className={classes.filter}
                name="kind"
                values={['Component', 'Template', 'Issue']}
              />
              <SearchFilter.Checkbox
                className={classes.filter}
                name="lifecycle"
                values={['experimental', 'production']}
              />
              {types && types.includes('github-issue') && <SearchFilter.Checkbox
                className={classes.filter}
                name="state"
                values={['open', 'closed']}
              />}
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <SearchResult>
              {({ results }) => (
                <List>
                  {results.map(({ type, document }) => {
                    switch (type) {
                      case 'software-catalog':
                        return (
                          <CatalogResultListItem
                            key={document.location}
                            result={document}
                          />
                        );
                      case 'techdocs':
                        return (
                          <DocsResultListItem
                            key={document.location}
                            result={document}
                          />
                        );
                      case 'github-issue':
                        return (
                          <IssueResultListItem
                            key={document.location}
                            result={document}
                          />
                        )
                      default:
                        return (
                          <DefaultResultListItem
                            key={document.location}
                            result={document}
                          />
                        );
                    }
                  })}
                </List>
              )}
            </SearchResult>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export const searchPage = <SearchPage />;
