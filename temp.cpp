#include<bits/stdc++.h>
using namespace std;
#define ll long long
#define fori for(int i=0;i<n;i++)

void calculate(vector<string> &usernames,vector<int> &timestamp,vector<string>&websites)
{
    map<string,vector<string>> mp;
    for(int i=0;i<usernames.size();i++)
        mp[usernames[i]].push_back(websites);
    map<string,int> count;
    for(auto it:mp)
    {
        vector<string> webs=it.second;
        if(webs.size()<3)
        continue;
        deque<string> three;
        for(int i=0;i<2;i++)
            three.push_back(webs[i]);
        
        
        for(int i=2;i<webs.size();i++)
        {
            deque.push_back(webs[i]);
            string s;
            for(int j=0;j<3;j++)
            {
                s+=three[j];
                s+='|';
            }
            count[s]++;
            deque.pop_front();
        }
    }
    string ans;
    int maxi=INT_MIN;
    for(auto it:count)
    {
        if(it.second>maxi)
        {
            maxi=it.second;
            ans=it.first;
        }
        if(it.second==maxi)
        ans=min(ans,it.first);
    }
    stringstream ss(ans);
    vector<string> fans;
    while(ss>>ans)
    fans.push_back(ans);

    return ans;


    

    




}
int main()
{
    return 0;
}