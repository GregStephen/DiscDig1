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
        string _albumBaseUrl;
        readonly IRestClient _client;
        readonly IRestClient _albumClient;
        string _key;
        string _secret;
       
        public DiscogsRepository(IConfiguration configuration)
        {
            _baseUrl = configuration.GetValue<string>("DiscogConnectionString");
            _albumBaseUrl = configuration.GetValue<string>("AlbumDiscogConnectionString");
            _secret = configuration.GetValue<string>("Secret");
            _key = configuration.GetValue<string>("Key");
            _client = new RestClient(_baseUrl);
            _albumClient = new RestClient(_albumBaseUrl);
            _albumClient.AddDefaultHeader("Authorization", $"Discogs key={_key}, secret={_secret}");
            _client.AddDefaultHeader("Authorization", $"Discogs key={_key}, secret={_secret}");

        }
        /// <summary>
        /// Gets a response from the Discog API from search parameters
        /// </summary>
        /// <param name="artistQuery">(optional) String representing artist name</param>
        /// <param name="albumQuery">(optional) String representing album name</param>
        /// <param name="page">Integer representing page number</param>
        /// <returns></returns>
        public DiscogResponse GetAlbumsFromDiscog(string artistQuery, string albumQuery, int page)
        {
           var request = new RestRequest();
  
            // searched for artist but did not search for an album as well so will return artists not albums
            if (artistQuery != "null" && albumQuery == "null")
            {
                request.AddParameter("query", artistQuery, ParameterType.QueryString);
                request.AddParameter("type", "artist", ParameterType.QueryString);
            }
            else
            {
                // will search for albums 
                request.AddParameter("type", "release", ParameterType.QueryString);
                request.AddParameter("format", "Vinyl", ParameterType.QueryString);
                // will include artist name in album search
                if (artistQuery != "null")
                {
                    request.AddParameter("artist", artistQuery, ParameterType.QueryString);
                }
                // will search for name of album
                if (albumQuery != "null" && albumQuery != "searchAll")
                {
                    request.AddParameter("release_title", albumQuery, ParameterType.QueryString);
                }
            }
            // adds the page parameters for pagination
            request.AddParameter("page", page, ParameterType.QueryString);
            request.AddParameter("per_page", 24, ParameterType.QueryString);
            var response = _client.Get<DiscogResponse>(request);

            if (response.ErrorException != null)
            {
                const string message = "Error retrieving response.  Check inner details for more info.";
                var discogException = new Exception(message, response.ErrorException);
                throw discogException;
            }
            return response.Data;
        }

        /// <summary>
        /// Retrieves a single album response from Discogs API
        /// </summary>
        /// <param name="id">Id for specific album release</param>
        /// <returns>Discogs API response</returns>
        public DiscogAlbumResponse GetAlbumFromDiscogById(int id)
        {
            var request = new RestRequest();

            request.AddParameter("release_id", id, ParameterType.UrlSegment);
            var response = _albumClient.Get<DiscogAlbumResponse>(request);
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
