import React, { useState } from "react";
import sortDates from "../util/sorting";

import Subscription from "./subscriptionType";

interface SubscriptionsModalProps {
  subscriptions: Subscription[];
  setSubscriptions: (subscriptions: Subscription[]) => void;
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: (showSubscriptionModal: boolean) => void;
}

function SubscriptionsModal(props: SubscriptionsModalProps) {
  const [subscriptionDate, setSubscriptionDate] = useState<string>("");
  const [subscriptionName, setSubscriptionName] = useState<string>("");
  const [subscriptionAmount, setSubscriptionAmount] = useState<number>(0);
  const [validationErrorMessage, setValidationErrorMessage] = useState<string>(
    ""
  );

  function handleSubscriptionSubmit(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();

    if (
      !_subscriptionValuesAreValid(
        subscriptionName,
        subscriptionAmount,
        subscriptionDate
      )
    ) {
      return;
    }

    const url = "/api/subscriptions";
    const formatDate = _formatDateForJSON(subscriptionDate);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: subscriptionName,
        amount: subscriptionAmount,
        dateDue: formatDate,
      }),
    };

    fetch(url, options)
      .then((response) => {
        if (response.status !== 200) {
          console.log("There was an error with the submitted data", response);
          return;
        }
        return response.json();
      })
      .then((payload) => {
        let subscriptions = props.subscriptions.concat([payload]);
        subscriptions.sort(sortDates);
        props.setSubscriptions(subscriptions);
        props.setShowSubscriptionModal(false);
      });
  }

  function _subscriptionValuesAreValid(
    subscriptionName: string,
    subscriptionAmount: number,
    subscriptionDate: string
  ): boolean {
    if (subscriptionName === "" || subscriptionDate === "") {
      setValidationErrorMessage("One or more fields is empty");
      return false;
    }

    if (subscriptionAmount <= 0) {
      setValidationErrorMessage("Amount can not be 0 or a negative number");
      return false;
    }
    return true;
  }

  function _formatDateForJSON(date: string): string {
    return date + "T00:00:00Z";
  }

  function handleSubscriptionDateChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setSubscriptionDate(event.target.value);
  }

  function handleSubscriptionNameChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setSubscriptionName(event.target.value);
  }

  function handleSubscriptionAmountChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setSubscriptionAmount(parseInt(event.target.value));
  }

  if (!props.showSubscriptionModal) {
    return null;
  }

  return (
    <div
      className="modal fade"
      id="addSubscriptionModal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="addSubscriptionModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addSubscriptionModalLabel">
              Add a subscription
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => props.setShowSubscriptionModal(false)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label htmlFor="subscription-name" className="col-form-label">
                  Subscription name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  onChange={(event) => handleSubscriptionNameChange(event)}
                  value={subscriptionName}
                  id="subscription-name"
                ></input>
              </div>
              <div className="form-group">
                <label htmlFor="subscription-amount" className="col-form-label">
                  Price:
                </label>
                <input
                  type="numeric"
                  className="form-control"
                  onChange={(event) => handleSubscriptionAmountChange(event)}
                  value={subscriptionAmount}
                  id="subscription-amount"
                ></input>
              </div>
              <div className="form-group">
                <label htmlFor="subscription-date" className="col-form-label">
                  Next payment date:
                </label>
                <input
                  type="date"
                  className="form-control"
                  onChange={(event) => handleSubscriptionDateChange(event)}
                  value={subscriptionDate}
                  id="subscription-date"
                ></input>
              </div>
            </form>
          </div>
          <div className="subscription-validation-error">
            {validationErrorMessage}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              onClick={() => props.setShowSubscriptionModal(false)}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              id="create-subscription-button"
              data-dismiss="modal"
              onClick={(event) => {
                setValidationErrorMessage("");
                handleSubscriptionSubmit(event);
              }}
            >
              Add subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionsModal;