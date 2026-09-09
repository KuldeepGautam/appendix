  window.UBISPageConfig = {
      sidebar: {
        brand: { ministry: 'Ministry of Finance', government: 'Government of India' },
        sectionLabel: 'Main Menu',
        items: [
          { label: 'Dashboard', icon: 'layout-dashboard', href: '#', expandable: true },
          {
            label: 'Pre-Budget Meeting', icon: 'calendar-days', href: '#', active: true, expanded: true,
            children: [
              { label: 'Pre-Budget Meeting', href: '#', active: true },
              { label: 'Autonomous Master/Grantee Bodies', href: '#' }
            ]
          },
          { label: 'DDG', icon: 'users-round', href: '#', expandable: true },
          { label: 'ECL', icon: 'settings-2', href: '#', expandable: true },
          { label: 'Exp Budget (SBE)', icon: 'indian-rupee', href: '#', expandable: true },
          { label: 'Exp Profile', icon: 'chart-column', href: '#', expandable: true },
          { label: 'Supplementary Budget', icon: 'file-plus-2', href: '#' },
          { label: 'Receipt Budget', icon: 'receipt', href: '#' },
          { label: 'Reappropriation', icon: 'arrow-left-right', href: '#' },
          { label: 'Autonomous/Grantee Bodies', icon: 'building-2', href: '#' },
          { label: 'Contingency Advance', icon: 'shield-check', href: '#' }
        ]
      },
      center: {
        breadcrumb: [
          { label: 'Pre-Budget Meeting' },
          { label: 'Department of Agriculture & Farmers Welfare' },
          { label: 'Appendix VI-A', current: true }
        ],
        demand: {
          id: 'pageDemandSelect', label: 'Demand', selected: 'Department of Agriculture & Farmers Welfare',
          options: [
            'Department of Agriculture & Farmers Welfare',
            'Department of Agricultural Research & Education'
          ]
        },
        appendix: {
          id: 'pageAppendixSelect', label: 'Appendix', selected: 'Appendix VI-A : List of User Charges levied by the Departments/Ministries',
          options: [
            'Appendix IV-A : Estimates of Expenditure Under Special Component Plan for Scheduled Castes',
            'Appendix VI-A : List of User Charges levied by the Departments/Ministries'
          ]
        },
        heading: {
          title: 'Appendix VI-A',
          description: 'List of User Charges levied by the Departments/Ministries',
          recordCount: '24 Records',
          icon: 'file-spreadsheet',
          status: { text: 'In Progress', color: 'blue' },
          primaryAction: { label: 'Add', icon: 'plus', type: 'drawer', mode: 'add' }
        }
      }
    };