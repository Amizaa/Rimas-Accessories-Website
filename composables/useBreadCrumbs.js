export const useBreadCrumbs = () => {

    const route = useRoute();
    const router = useRouter();
    

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
        
        if (crumb == 'همه محصولات') {
          return
        }

        if (crumb == 'category') {
          breadcrumbs.push({label: 'همه محصولات', to:'/category/همه محصولات'});
        }else{

          breadcrumbs.push({label: crumb, to:path});
        }
  
        }
    });


  return breadcrumbs;
}