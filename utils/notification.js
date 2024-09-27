module.exports.fetchNotificationDetails = async (type, options) => {
  let title = "";
  let body = "";
  if (type === "test") {
    title = "Test Notification";
    body = "This is a test notification";
  }
  if (type === "update-transaction") {
    if (options?.transactionStatus) {
      const status = options?.transactionStatus;
      if (status === "pending") {
        title = "Your Transaction is Being Processed";
        body = "Your transaction is currently being processed. We’ll notify you once it’s completed";
      }
      if (status === "accepted") {
        title = "Your Transaction Has Been Approved";
        body = "Great news! Your transaction has been successfully approved";
      }
      if (status === "declined") {
        title = "We're Sorry! Your Transaction Was Not Approved";
        body =
          "Unfortunately, your transaction was declined. Please review the transaction details or reach out for help.";
      }
    }
  }
  return { title, body };
};
