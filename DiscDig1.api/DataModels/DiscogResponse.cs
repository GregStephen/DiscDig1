﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.DataModels
{
    public class Urls
    {
        public string last { get; set; }
        public string next { get; set; }
    }

    public class Pagination
    {
        public int per_page { get; set; }
        public int pages { get; set; }
        public int page { get; set; }
        public Urls urls { get; set; }
        public int items { get; set; }
    }

    public class Community
    {
        public int want { get; set; }
        public int have { get; set; }
    }

    public class Result
    {
        public List<string> style { get; set; }
        public string thumb { get; set; }
        public string title { get; set; }
        public string country { get; set; }
        public List<string> format { get; set; }
        public string uri { get; set; }
        public Community community { get; set; }
        public List<string> label { get; set; }
        public string catno { get; set; }
        public string year { get; set; }
        public List<string> genre { get; set; }
        public string resource_url { get; set; }
        public string type { get; set; }
        public int id { get; set; }
        public List<string> barcode { get; set; }
        public object master_url { get; set; }
        public string cover_image { get; set; }
        public object master_id { get; set; }
    }

    public class DiscogResponse
    {
        public Pagination pagination { get; set; }
        public List<Result> results { get; set; }
    }
}
