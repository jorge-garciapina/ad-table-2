// CHARTS IMPORTS:
import HandlingOverviewChart from "../charts/handling_overview/comp_handling_overview_chart";

// COMPONENT IMPORTS

import { DashboardChartsContainer } from "../../mui_configurations/styled_components/styled_app_container";
import { DateRangeSelector } from "../date_related_components/date_range_selector/comp_range_selector";

// UTILS
import { generateInitialDateInterval } from "../../utils/dates/utils_dates";

// HOOKS
import { useDate } from "../../hooks/date_hooks/hook_use_date";

// LIBRARY IMPORTS
import { Button } from "@mui/material";
import { useState, ReactNode } from "react";
import { useTranslation } from "react-i18next";


import { ChartModalContainer } from "../modals/comp_modal_container";

const DashboardCharts = () => {
  //----------------START: Translation Section----------------
  const { t, i18n } = useTranslation();
  // Function to toggle language
  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLanguage);
  };
  //----------------END: Translation Section----------------
  //-------------------------------------------------------------
  //----------------START: Refresh Section----------------
  const [refreshTrigger, setRefreshTrigger] = useState(Date.now());
  function handleRefresh() {
    setRefreshTrigger(Date.now()); // Update the trigger
  }
  //----------------END: Refresh Section----------------
  //-------------------------------------------------------------
  //----------------START: Date Section----------------
  // TODO: it is important to consider that this functionality might be removed,
  //       (the date interval will be controlled in the details or data modals)
  const { initialDate: start, endDate: end } = generateInitialDateInterval();
  const initialDayLogic = useDate(start);
  const endDayLogic = useDate(end);
  //----------------END: Date Section----------------
  //-------------------------------------------------------------
  //----------------START: Modal Section----------------
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ReactNode>(<></>);
  function closeModal() {
    setIsModalOpen(false);
    setModalContent(<></>);
  }

  //FIXME: This function whould go inside the <DashboardChar/>
  function renderModal(chartModal: ReactNode) {
    setIsModalOpen(true);
    setModalContent(
      <ChartModalContainer onClose={closeModal}>
        {chartModal}
      </ChartModalContainer>
    );
  }
  //----------------END: Modal Section----------------

  //TODO: It is important to consider that the buttons for the details and chart 
  //      data will be called here

  return (
    <DashboardChartsContainer>
      <Button variant="contained" onClick={handleRefresh}>
        Refresh
      </Button>
      <Button variant="contained" onClick={toggleLanguage}>
        {t("changeLanguage")}
      </Button>{" "}
      <DateRangeSelector
        initialDateModifier={(date) => {
          initialDayLogic.updateDate(date);
        }}
        endDateModifier={(date) => {
          endDayLogic.updateDate(date);
        }}
        initialDate={initialDayLogic.date}
        endDate={endDayLogic.date}
      />
      <HandlingOverviewChart
        initialDate={initialDayLogic.date}
        endDate={endDayLogic.date}
        refreshTrigger={refreshTrigger}
        renderModal={renderModal}
      />
      {isModalOpen && modalContent}
    </DashboardChartsContainer>
  );
};

export default DashboardCharts;
