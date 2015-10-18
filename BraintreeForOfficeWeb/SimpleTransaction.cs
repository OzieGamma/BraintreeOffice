using System;
using Braintree;

namespace BraintreeForOfficeWeb
{
    public class SimpleTransaction
    {
        public string Id { get; set; }
        public string MerchantAccountId { get; set; }
        public string Status { get; set; }
        public decimal? Amount { get; set; }
        public decimal? TaxAmount { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string CurrencyIsoCode { get; set; }
    }
}