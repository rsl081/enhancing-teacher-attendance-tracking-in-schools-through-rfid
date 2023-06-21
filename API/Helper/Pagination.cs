namespace API.Helper
{
    public class Pagination<T> where T : class
    {
        public Pagination(int count, IReadOnlyList<T> data)
        {
            Count = count;
            Data = data;
        }
        
        public int Count { get; set; }
        public IReadOnlyList<T> Data { get; set; }
    }
}