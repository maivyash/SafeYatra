 #list is declared in []
# list is a mutable/changable datatype

marks=[90,80,78,97,78,67,94]
print(type(marks))                    
print(marks)

print(marks[0])
print(marks[4])
print(marks[6])
print(marks[:2])
print(marks[4:])
print(marks[-5])
print(marks[1:5])



print("-----FOLLOWING ARE THE LIST OPERATION:----")

list2=["Arshad","Vaibhav","Yash","Mahesh","Rudra"]
print(list2)

list2[1]="Rahul"        #change name
print(list2)

student=["Arshad",15,"pune"]
print(student)


# change value using index
student[1]=4
print(student)


list3=[90,54,76,38,94,85,82,734,61]
print(list3)

#append
list3.append(45)   
print(list3)

#sort list in ascending order
list4=[9,5,2,8,1,0,4,2,6,5,]
list4.sort()
print(list4)

#sort list in descending order
list5=[1,3,2,6,4,9,7,8,5,3,0]
list5.sort(reverse=True)
print(list5)

# reverse the list
list6=[9,5,2,8,1,0,4,2,6,5]
list6.reverse()
print(list6)
