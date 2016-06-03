import React from 'react';

import { Route, IndexRoute } from 'react-router';

import App from '../containers/App';

import CellLineBrowserPage from '../containers/CellLineBrowserPage';
import CellLineDetailPage from '../containers/CellLineDetailPage';

import DrugBrowserPage from '../containers/DrugBrowserPage';
import DrugDetailPage from '../containers/DrugDetailPage';

import DatasetSummaryPage from '../containers/DatasetSummaryPage';

import DatasetReceptorProfilePage from '../containers/DatasetReceptorProfilePage';
import DatasetBasalPhosphoPage from '../containers/DatasetBasalPhosphoPage';
import DatasetBasalTotalPage from '../containers/DatasetBasalTotalPage';
import DatasetGrowthFactorPaktPerkPage from '../containers/DatasetGrowthFactorPaktPerkPage';
import DatasetDrugDoseResponsePage from '../containers/DatasetDrugDoseResponsePage';
import DatasetBasePage from '../containers/DatasetBasePage';

import HomePage from '../containers/HomePage';
import About from '../components/About';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="cell_lines" component={CellLineBrowserPage} />
    <Route path="/cell_line/:cellLineId" component={CellLineDetailPage} />
    <Route path="/drugs" component={DrugBrowserPage} />
    <Route path="/drug/:drugId" component={DrugDetailPage} />
    <Route path="datasets" component={DatasetSummaryPage} />
    <Route path="dataset">
      <Route path="receptor_profile" component={DatasetReceptorProfilePage} />
      <Route path="basal_phospho" component={DatasetBasalPhosphoPage} />
      <Route path="basal_total" component={DatasetBasalTotalPage} />
      <Route path="growth_factor_pakt_perk" component={DatasetGrowthFactorPaktPerkPage} />
      <Route path="drug_dose_response" component={DatasetDrugDoseResponsePage} />
    </Route>
    <Route path="about" component={About} />
  </Route>
);
