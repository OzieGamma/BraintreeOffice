using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.DynamicData;
using System.Web.Http;
using Braintree;

namespace BraintreeForOfficeWeb
{
    public class BraintreeController : ApiController
    {
        private DateTime FromUnixTime(long unixTime)
        {
            var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            return epoch.AddMilliseconds(unixTime);
        }

        // GET api/<controller>
        public IEnumerable<SimpleTransaction> Get(string pub, string priv, string merchant, long from, long to)
        {
            var gateway = new BraintreeGateway
            {
                Environment = Braintree.Environment.SANDBOX,
                MerchantId = merchant,
                PublicKey = pub,
                PrivateKey = priv
            };

            var fromDate = FromUnixTime(from);
            var toDate = FromUnixTime(to).AddDays(1);

            var request = new TransactionSearchRequest().SubmittedForSettlementAt.Between(fromDate, toDate);

            ResourceCollection<Transaction> collection = gateway.Transaction.Search(request);

            return (from Transaction transaction in collection
                    select new SimpleTransaction
                    {
                        Id = transaction.Id,
                        MerchantAccountId = transaction.MerchantAccountId,
                        Status = transaction.Status.ToString(),
                        Amount = transaction.Amount,
                        TaxAmount = transaction.TaxAmount,
                        CreatedAt = transaction.CreatedAt,
                        CurrencyIsoCode = transaction.CurrencyIsoCode
                    }).ToList();   
        }
    }
}