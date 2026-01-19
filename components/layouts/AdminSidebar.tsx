import { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  X,
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MessageCircleQuestion
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubMenuItem {
  label: string;
  path: string;
  active?: boolean;
}

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path?: string;
  active?: boolean;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: '대시보드', path: '/admin', active: true },
  { 
    icon: Package, 
    label: '상품관리', 
    active: false,
    subItems: [
      { label: '상품 목록', path: '/admin/products', active: false },
      { label: '상품 등록', path: '/admin/products/new', active: false },
    ]
  },
  { icon: MessageCircleQuestion, label: 'QnA관리', path: '/admin/qna', active: false },
];

export function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">Admin</span>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
             <div className="space-y-1">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => toggleExpand(item.label)}
                        className={`
                          w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors
                          ${item.active 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="flex items-center">
                          <item.icon className="w-5 h-5 mr-3" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {expandedItems.includes(item.label) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      
                      {expandedItems.includes(item.label) && (
                        <div className="mt-1 ml-4 space-y-1">
                          {item.subItems.map((subItem, subIndex) => (
                            <button
                              key={subIndex}
                              onClick={() => handleNavigate(subItem.path)}
                              className={`
                                w-full flex items-center px-4 py-2 rounded-lg transition-colors text-sm text-left
                                ${subItem.active 
                                  ? 'bg-blue-50 text-blue-600 font-medium' 
                                  : 'text-gray-600 hover:bg-gray-50'
                                }
                              `}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current mr-3"></span>
                              {subItem.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => item.path && handleNavigate(item.path)}
                      className={`
                        w-full flex items-center px-4 py-3 rounded-lg transition-colors text-left
                        ${item.active 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 font-medium">JD</span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">john@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
