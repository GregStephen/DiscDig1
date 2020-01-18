using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.DataModels
{
    public class Artist
    {
        public string anv { get; set; }
        public int id { get; set; }
        public string join { get; set; }
        public string name { get; set; }
        public string resource_url { get; set; }
        public string role { get; set; }
        public string tracks { get; set; }
    }


    public class Rating
    {
        public double average { get; set; }
        public int count { get; set; }
    }

    public class Company
    {
        public string catno { get; set; }
        public string entity_type { get; set; }
        public string entity_type_name { get; set; }
        public int id { get; set; }
        public string name { get; set; }
        public string resource_url { get; set; }
    }

    public class Extraartist
    {
        public string anv { get; set; }
        public int id { get; set; }
        public string join { get; set; }
        public string name { get; set; }
        public string resource_url { get; set; }
        public string role { get; set; }
        public string tracks { get; set; }
    }

    public class Format
    {
        public List<string> descriptions { get; set; }
        public string name { get; set; }
        public string qty { get; set; }
    }

    public class Identifier
    {
        public string type { get; set; }
        public string value { get; set; }
    }

    public class Image
    {
        public int height { get; set; }
        public string resource_url { get; set; }
        public string type { get; set; }
        public string uri { get; set; }
        public string uri150 { get; set; }
        public int width { get; set; }
    }

    public class Label
    {
        public string catno { get; set; }
        public string entity_type { get; set; }
        public int id { get; set; }
        public string name { get; set; }
        public string resource_url { get; set; }
    }

    public class Tracklist
    {
        public string duration { get; set; }
        public string position { get; set; }
        public string title { get; set; }
        public string type_ { get; set; }
    }

    public class Video
    {
        public string description { get; set; }
        public int duration { get; set; }
        public bool embed { get; set; }
        public string title { get; set; }
        public string uri { get; set; }
    }

    public class DiscogAlbumResponse
    {
        public string title { get; set; }
        public int id { get; set; }
        public List<Artist> artists { get; set; }
        public string data_quality { get; set; }
        public string thumb { get; set; }
        public List<Company> companies { get; set; }
        public string country { get; set; }
        public DateTime date_added { get; set; }
        public DateTime date_changed { get; set; }
        public int estimated_weight { get; set; }
        public List<Extraartist> extraartists { get; set; }
        public int format_quantity { get; set; }
        public List<Format> formats { get; set; }
        public List<string> genres { get; set; }
        public List<Identifier> identifiers { get; set; }
        public List<Image> images { get; set; }
        public List<Label> labels { get; set; }
        public double lowest_price { get; set; }
        public int master_id { get; set; }
        public string master_url { get; set; }
        public string notes { get; set; }
        public int num_for_sale { get; set; }
        public string released { get; set; }
        public string released_formatted { get; set; }
        public string resource_url { get; set; }
        public List<object> series { get; set; }
        public string status { get; set; }
        public List<string> styles { get; set; }
        public List<Tracklist> tracklist { get; set; }
        public string uri { get; set; }
        public List<Video> videos { get; set; }
        public int year { get; set; }
    }
}
