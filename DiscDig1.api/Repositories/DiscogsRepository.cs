using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DiscDig1.DataModels;
using Microsoft.Extensions.Configuration;
using RestSharp;
using RestSharp.Authenticators;


namespace DiscDig1.Repositories
{

    public class DiscogsRepository : IDiscogRepository
    {
        string _baseUrl;
        readonly IRestClient _client;
        string _key;
        string _secret;
       
        public DiscogsRepository(IConfiguration configuration)
        {
            _baseUrl = configuration.GetValue<string>("DiscogConnectionString");
            _secret = configuration.GetValue<string>("Secret");
            _key = configuration.GetValue<string>("Key");
            _client = new RestClient(_baseUrl);
            _client.AddDefaultHeader("Authorization", $"Discogs key={_key}, secret={_secret}");

        }
        public DiscogResponse GetAlbumsFromDiscog(string query)
        {
            var request = new RestRequest();

            request.AddParameter("q", query, ParameterType.QueryString); // used on every request
            var response = _client.Get<DiscogResponse>(request);

            if (response.ErrorException != null)
            {
                const string message = "Error retrieving response.  Check inner details for more info.";
                var discogException = new Exception(message, response.ErrorException);
                throw discogException;
            }
            return response.Data;
        }

    }
}
