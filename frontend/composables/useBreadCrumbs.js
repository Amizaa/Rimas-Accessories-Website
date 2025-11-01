export const useBreadCrumbs = () => {

    const route = useRoute();
    const router = useRouter();
    
    const search = route.query.search

    const fullPath = decodeURIComponent(route.path);
 
  
    const requestPath = fullPath.startsWith("/")
                        ? fullPath.substring(1)
                        : fullPath;
    const crumbs = requestPath.split("/");

    let breadcrumbs = [   
      {
        label: 'خانه',
        to: '/'
      },
  ]

    let path = "";


    crumbs.forEach((crumb) => {
    if (crumb) {
        path = `${path}/${crumb}`;
        
        if (crumb == 'all') {
          return
        }

        if (crumb == 'category') {
          breadcrumbs.push({label: 'همه محصولات', to:'/category/all'});
        }else{

          breadcrumbs.push({label: crumb, to:path});
        }
  
        }
    });

    if (search) {
      breadcrumbs.push({label: `نتیجه جست و جو برای ${search}`, to:`/category/all?search=${search}`})
    }


  return breadcrumbs;
}