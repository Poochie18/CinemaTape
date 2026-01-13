import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-12 text-center"
    >
      {Icon && <Icon className="w-16 h-16 mx-auto text-gray-600 mb-4" />}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-gray-400 mb-4">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
