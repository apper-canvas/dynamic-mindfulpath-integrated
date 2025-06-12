import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Pill from '@/components/atoms/Pill';
import Card from '@/components/molecules/Card';

const TherapySessionItem = ({ session, index, onEdit, onDelete, totalSessions }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card delay={index * 0.1}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <Text as="h3" className="text-lg font-semibold text-gray-800">
            {formatDate(session.date)}
          </Text>
          <Text as="p" className="text-sm text-gray-500">
            Session #{totalSessions - index}
          </Text>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => onEdit(session)}
            variant="ghost"
            size="small"
            className="p-2"
          >
            <ApperIcon name="Edit" size={16} />
          </Button>
          <Button
            onClick={() => onDelete(session.id)}
            variant="ghost"
            size="small"
            className="p-2 hover:text-error"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>

      {session.topics && session.topics.length > 0 && (
        <div className="mb-4">
          <Text as="h4" className="text-sm font-medium text-gray-700 mb-2">Topics Discussed:</Text>
          <div className="flex flex-wrap gap-2">
            {session.topics.map((topic) => (
              <Pill key={topic} color="primary">
                {topic}
              </Pill>
            ))}
          </div>
        </div>
      )}

      <div>
        <Text as="h4" className="text-sm font-medium text-gray-700 mb-2">Reflection:</Text>
        <Text as="p" className="text-gray-600 leading-relaxed whitespace-pre-wrap">
          {session.reflection}
        </Text>
      </div>
    </Card>
  );
};

const TherapySessionList = ({ sessions, onEdit, onDelete, onAddSession }) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="BookOpen" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <Text as="h3" className="text-lg font-semibold text-gray-800 mb-2">No therapy sessions yet</Text>
        <Text as="p" className="text-gray-600 mb-4">
          Start documenting your therapy journey by adding your first session
        </Text>
        <Button
          onClick={onAddSession}
          variant="primary"
          size="large"
        >
          Add Your First Session
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sessions.map((session, index) => (
        <TherapySessionItem
          key={session.id}
          session={session}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          totalSessions={sessions.length}
        />
      ))}
    </div>
  );
};

export default TherapySessionList;